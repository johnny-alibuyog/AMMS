using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using FluentValidation;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Tenants
{
    public class TenantEnvironmentCreate
    {
        public class Request : IRequest<Response>
        {
            public Dtos.Tenant Tenant { get; set; }

            public Dtos.Branch Branch { get; set; }

            public Dtos.User User { get; set; }

            public string DefaultPassword { get; set; }
        }

        public class Response
        {
            public string TenantId { get; set; }

            public string BranchId { get; set; }

            public string RoleId { get; set; }

            public string UserId { get; set; }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator(Dtos.TenantValidator tenantValidator, Dtos.BranchValidator branchValidator, Dtos.UserValidator userValidator)
            {
                RuleFor(x => x.Tenant).SetValidator(tenantValidator);

                RuleFor(x => x.Branch).SetValidator(branchValidator);

                RuleFor(x => x.User).SetValidator(userValidator);

                RuleFor(x => x.DefaultPassword).NotNull().NotEmpty();
            }
        }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.All, Access.Super));
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var tenant = Mapper.Map<Tenant>(request.Tenant);

                await Db.Membership.Tenants.InsertOneAsync(tenant, new InsertOneOptions(), cancellationToken);

                var branch = Mapper.Map<Branch>(request.Branch);

                branch.SetTenant(tenant.Id);

                await Db.Membership.Branches.InsertOneAsync(branch, new InsertOneOptions(), cancellationToken);

                var adminRole = new Role(
                    tenantId: tenant.Id, 
                    name: $"{tenant.Name} Admin Role", 
                    permissions: Permission.Template
                );

                await Db.Membership.Roles.InsertOneAsync(adminRole, new InsertOneOptions(), cancellationToken);

                var userSettings = new TenantUserSettings(
                    tenantId: tenant.Id,
                    defaultPassword: request.DefaultPassword
                );

                await Db.Common.Settings.InsertOneAsync(userSettings, new InsertOneOptions(), cancellationToken);

                var admin = Mapper.Map<User>(request.User);

                admin.SetPassword(userSettings.DefaultPassword);

                admin.SetTenant(tenant.Id);

                admin.SetRoles(new[] { adminRole.Id });

                admin.SetBranches(new[] { branch.Id });

                await Db.Membership.Users.InsertOneAsync(admin, new InsertOneOptions(), cancellationToken);

                return new Response()
                {
                    TenantId = tenant.Id,
                    BranchId = branch.Id,
                    RoleId = adminRole.Id,
                    UserId = admin.Id
                };
            }
        }
    }
}

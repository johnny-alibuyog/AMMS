using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Models;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
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
            public string TenantCode { get; set; }

            public string TenantName { get; set; }
        }

        public class Response
        {
            public Dtos.Tenant Tenant { get; set; }

            public string AdminUserame { get; set; }

            public string AdminPassword { get; set; }
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
                var tenant = new Tenant(request.TenantCode, request.TenantName);

                await Db.Membership.Tenants.InsertOneAsync(tenant, new InsertOneOptions(), cancellationToken);

                var adminRole = new Role(tenant.Id, $"{tenant.Name} Admin Role", permissions: Permission.Template);

                await Db.Membership.Roles.InsertOneAsync(adminRole);

                //var admin = new User(
                //    tenantId: tenant.Id,
                //    branchId: null,
                //    username: $"{tenant.Name.ToLowerInvariant()}_admin",
                //    person: new Person(tenant.Name, "Admin", null, null),
                //    homeAddress: new Address("Street", "Barangay", "City", "Province", "Region", "Country", "ZipCode"),
                //    roleIds: new[] { adminRole.Id }
                //);


                return Mapper.Map<Response>(tenant);
            }
        }
    }
}

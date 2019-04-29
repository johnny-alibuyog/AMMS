using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Utils.Extentions;
using AutoMapper;
using Bogus;
using FluentValidation;
using System.Collections.Generic;
using System.Linq;

namespace AMMS.Domain.Membership.Messages.Dtos
{
    public class Role : Equatable<Role>
    {
        public string Id { get; set; }

        public string TenantId { get; set; }

        public string Name { get; set; }

        public IEnumerable<Permission> Permissions { get; set; }
    }

    public class RoleValidator : AbstractValidator<Role>
    {
        public RoleValidator()
        {
            RuleFor(x => x.TenantId)
                .NotNull().NotEmpty();

            RuleFor(x => x.Name)
                .NotNull().NotEmpty();

            RuleFor(x => x.Permissions)
                .NotNull().NotEmpty();
        }
    }

    public class RoleFaker : Faker<Role>
    {
        private readonly PermissionFaker _permissionFaker;

        public RoleFaker(PermissionFaker permissionFaker)
        {
            _permissionFaker = permissionFaker;
        }

        public RoleFaker()
        {
            RuleFor(x => x.Name, (x, y) => x.Name.JobType());

            RuleFor(x => x.Permissions, (x, y) => Enumerable
                .Range(1, x.Random.Int(1, EnumEx.GetList<Area>().Count()))
                .Select(_ => _permissionFaker.Generate())
            );
        }
    }

    public class RoletProfile : Profile
    {
        public RoletProfile()
        {
            CreateMap<Models.Area, Dtos.Area>();

            CreateMap<Models.Access, Dtos.Access>();

            CreateMap<Models.Role, Dtos.Role>();
        }
    }
}

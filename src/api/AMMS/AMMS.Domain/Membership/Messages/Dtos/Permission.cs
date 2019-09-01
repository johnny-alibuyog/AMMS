using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Utils.Extentions;
using AutoMapper;
using Bogus;
using FluentValidation;
using System.Collections.Generic;
using System.Linq;

namespace AMMS.Domain.Membership.Messages.Dtos
{
    public enum Area
    {
        All,
        Tenant,
        TenantUserSettings,
        Branch,
        Role,
        User,
        UserPassword,
    }

    public enum Access
    {
        Read,
        Create,
        Update,
        Delete,
        Super,
    }

    public class Permission : Equatable<Permission>
    {
        public Area Area { get; set; }

        public List<Access> AccessRights { get; set; }
    }

    public class PermissionValidator : AbstractValidator<Permission>
    {
        public PermissionValidator()
        {
            RuleFor(x => x.Area)
                .NotNull().NotEmpty();

            RuleFor(x => x.AccessRights)
                .NotNull().NotEmpty();
        }
    }

    public class PermissionFaker : Faker<Permission>
    {
        public PermissionFaker()
        {
            RuleFor(x => x.Area, (x, y) => x.PickRandom<Area>());

            RuleFor(x => x.AccessRights, (x, y) => x.PickRandom(EnumEx.GetList<Access>(), 3).ToList());
        }
    }

    public class PermissiontProfile : Profile
    {
        public PermissiontProfile()
        {
            CreateMap<Models.Area, Dtos.Area>().ReverseMap();

            CreateMap<Models.Access, Dtos.Access>().ReverseMap();

            CreateMap<Models.Permission, Dtos.Permission>().ReverseMap();
        }
    }
}

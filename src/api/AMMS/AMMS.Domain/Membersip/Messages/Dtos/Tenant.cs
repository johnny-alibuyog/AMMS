using AutoMapper;
using FluentValidation;

namespace AMMS.Domain.Membership.Messages.Dtos
{
    public class Tenant
    {
        public string Id { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }
    }

    public class TenantValidator : AbstractValidator<Tenant>
    {
        public TenantValidator()
        {
            RuleFor(x => x.Id);

            RuleFor(x => x.Code)
                .NotNull().NotEmpty();

            RuleFor(x => x.Name)
                .NotNull().NotEmpty();
        }
    }

    public class TenantProfile : Profile
    {
        public TenantProfile()
        {
            CreateMap<Models.Tenant, Dtos.Tenant>();
        }
    }
}

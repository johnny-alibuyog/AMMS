using AMMS.Domain.Common.Messages.Dtos;
using AutoMapper;
using Bogus;
using FluentValidation;

namespace AMMS.Domain.Membership.Messages.Dtos
{
    public class Tenant : Equatable<Tenant>
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

    public class TenantFaker : Faker<Tenant>
    {
        public TenantFaker()
        {
            RuleFor(x => x.Code, (x, y) => x.Random.AlphaNumeric(8));

            RuleFor(x => x.Name, (x, y) => x.Company.CompanyName());
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

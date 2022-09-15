using AMMS.Domain.Common.Messages.Dtos;
using AutoMapper;
using Bogus;
using FluentValidation;

namespace AMMS.Domain.Membership.Messages.Dtos;

public class Branch : Equatable<Branch>
{
    public string Id { get; set; }

    public string TenantId { get; set; }

    public string Code { get; set; }

    public string Name { get; set; }
}

public class BranchValidator : AbstractValidator<Branch>
{
    public BranchValidator()
    {
        RuleFor(x => x.Id);

        RuleFor(x => x.TenantId);

        RuleFor(x => x.Code)
            .NotNull().NotEmpty();

        RuleFor(x => x.Name)
            .NotNull().NotEmpty();
    }
}

public class BranchFaker : Faker<Branch>
{
    public BranchFaker()
    {
        RuleFor(x => x.TenantId, (x, y) => x.Random.AlphaNumeric(8));

        RuleFor(x => x.Code, (x, y) => x.Random.AlphaNumeric(8));

        RuleFor(x => x.Name, (x, y) => x.Address.State() + " Branch");
    }
}

public class BranchtProfile : Profile
{
    public BranchtProfile()
    {
        CreateMap<Models.Branch, Dtos.Branch>().ReverseMap();
    }
}

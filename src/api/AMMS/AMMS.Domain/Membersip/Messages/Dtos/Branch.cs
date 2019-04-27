using AutoMapper;
using FluentValidation;

namespace AMMS.Domain.Membership.Messages.Dtos
{
    public class Branch
    {
        public string Id { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }
    }

    public class BranchValidator : AbstractValidator<Branch>
    {
        public BranchValidator()
        {
            RuleFor(x => x.Id);

            RuleFor(x => x.Code)
                .NotNull().NotEmpty();

            RuleFor(x => x.Name)
                .NotNull().NotEmpty();
        }
    }

    public class BranchtProfile : Profile
    {
        public BranchtProfile()
        {
            CreateMap<Models.Branch, Dtos.Branch>();
        }
    }
}

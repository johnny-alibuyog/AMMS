using FluentValidation;

namespace AMMS.Domain.Common.Messages
{
    public abstract class WithId<T>
    {
        public abstract T Id { get; set; }
    }

    public class WithStringId : WithId<string>
    {
        public override string Id { get; set; }
    }

    public class WithIntId : WithId<int>
    {
        public override int Id { get; set; }
    }

    public class WithStringIdValidator : AbstractValidator<WithStringId>
    {
        public WithStringIdValidator()
        {
            RuleFor(x => x.Id).NotNull().NotEmpty();
        }
    }

    public class WithIntIdValidator : AbstractValidator<WithIntId>
    {
        public WithIntIdValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0);
        }
    }
}

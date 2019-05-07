using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using FluentValidation;
using FluentValidation.Results;
using MediatR;

namespace AMMS.Domain.Membership.Messages.Users
{
    public class UserChangePassword
    {
        public class Request : IRequest<Response>
        {
            public string UserId { get; set; }

            public string CurrentPassword { get; set; }

            public string NewPassword { get; set; }

            public string ConfrimPassword { get; set; }
        }

        public class Response { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.UserPassword, Access.Update));
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator(IContext context)
            {
                RuleFor(x => x.UserId).NotNull().NotEmpty();
                RuleFor(x => x.CurrentPassword);
                RuleFor(x => x.NewPassword).NotNull().NotEmpty();
                RuleFor(x => x.ConfrimPassword).NotNull().NotEmpty();
                RuleFor(x => x).Custom((instance, validationContext) =>
                {
                    if (instance.NewPassword != instance.ConfrimPassword)
                    {
                        validationContext.AddFailure(
                            new ValidationFailure(
                                propertyName: "Request.NewPassword",
                                errorMessage: $"'New Password' does not match with 'Confirmation Password'"
                            )
                        );
                    }
                });
            }
        }
    }
}

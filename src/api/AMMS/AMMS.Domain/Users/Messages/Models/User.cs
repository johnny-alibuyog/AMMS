using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Models;
using AutoMapper;
using FluentValidation;

namespace AMMS.Domain.Users.Messages.Models
{
    public class User
    {
        public string Id { get; set; }

        public string Username { get; set; }

        public Person Person { get; set; }

        public Address HomeAddress { get; set; }

        static User()
        {
            Mapper.Initialize(config =>
            {
                config.CreateMap<Models.User, Entities.User>();
                config.CreateMap<FindMessage.Response, Lookup<string>>();
                config.CreateMap<GetMessage.Response, Entities.User>();
            });
        }
    }

    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor(x => x.Id);
            RuleFor(x => x.Username).NotNull().NotEmpty();
            RuleFor(x => x.Person).NotNull().SetValidator(new PersonValidator());
            RuleFor(x => x.HomeAddress).NotNull().SetValidator(new AddressValidator());
        }
    }
}

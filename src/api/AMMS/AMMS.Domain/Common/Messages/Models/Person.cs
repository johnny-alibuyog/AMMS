using AutoMapper;
using FluentValidation;
using System;

namespace AMMS.Domain.Common.Messages.Models
{
    public class Person
    {
        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string Fullname => $"{this.FirstName} {this.LastName}";

        public DateTime? BirthDate { get; set; }

        static Person()
        {
            Mapper.Initialize(config => config.CreateMap<Models.Person, Entities.Person>());
        }
    }

    public class PersonValidator : AbstractValidator<Person>
    {
        public PersonValidator()
        {
            RuleFor(x => x.FirstName).NotNull().NotEmpty();
            RuleFor(x => x.MiddleName);
            RuleFor(x => x.LastName).NotNull().NotEmpty();
            RuleFor(x => x.BirthDate);
        }
    }
}

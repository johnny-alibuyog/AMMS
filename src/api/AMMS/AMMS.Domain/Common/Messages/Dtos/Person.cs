using AutoMapper;
using Bogus;
using Bogus.DataSets;
using FluentValidation;
using System;

namespace AMMS.Domain.Common.Messages.Dtos
{
    public enum Gender
    {
        Male = 0,
        Female = 1
    }

    public class Person : Equatable<Person>
    {
        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public Gender? Gender { get; set; } 

        public string Fullname => $"{this.FirstName} {this.LastName}";

        public DateTime? BirthDate { get; set; }
    }

    public class PersonValidator : AbstractValidator<Person>
    {
        public PersonValidator()
        {
            RuleFor(x => x.FirstName)
                .NotNull().NotEmpty();

            RuleFor(x => x.MiddleName);

            RuleFor(x => x.LastName)
                .NotNull().NotEmpty();

            RuleFor(x => x.Gender);

            RuleFor(x => x.BirthDate);
        }
    }

    public class PersonFaker : Faker<Person>
    {
        public PersonFaker()
        {
            RuleFor(x => x.Gender, (x, y) => x.PickRandom<Dtos.Gender>());

            RuleFor(x => x.FirstName, (x, y) => x.Name.FirstName(y.Gender.Map()));

            RuleFor(x => x.LastName, (x, y) => x.Name.LastName(y.Gender.Map()));

            RuleFor(x => x.MiddleName, (x, y) => x.Name.LastName(y.Gender.Map()));

            RuleFor(x => x.BirthDate, (x, y) => x.Person.DateOfBirth.Date.ToUniversalTime());
        }
    }

    internal static class FakePersonEx
    {
        public static Name.Gender Map(this Dtos.Gender? gender)
        {
            return gender.HasValue && Enum.TryParse<Name.Gender>(gender.Value.ToString(), out var result)
                ? result : Name.Gender.Male;
        }
    }

    public class PersonProfile : Profile
    {
        public PersonProfile()
        {
            CreateMap<Models.Person, Dtos.Person>().ReverseMap();
        }
    }
}

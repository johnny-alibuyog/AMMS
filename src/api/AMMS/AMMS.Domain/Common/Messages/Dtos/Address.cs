using AutoMapper;
using Bogus;
using FluentValidation;

namespace AMMS.Domain.Common.Messages.Dtos
{
    public class Address : Equatable<Address>
    {
        public string Unit { get; set; }

        public string Street { get; set; }

        public string Subdivision { get; set; }

        public string District { get; set; }

        public string Municipality { get; set; }

        public string Province { get; set; }

        public string Country { get; set; }

        public string ZipCode { get; set; }
    }

    public class AddressValidator : AbstractValidator<Address>
    {
        public AddressValidator()
        {
            RuleFor(x => x.Unit);

            RuleFor(x => x.Street);

            RuleFor(x => x.Subdivision);

            RuleFor(x => x.District);

            RuleFor(x => x.Municipality);

            RuleFor(x => x.Province);

            RuleFor(x => x.Country);

            RuleFor(x => x.ZipCode);
        }
    }

    public class AddressFaker : Faker<Address>
    {
        public AddressFaker()
        {
            RuleFor(x => x.Unit, (x, y) => x.Address.BuildingNumber());

            RuleFor(x => x.Street, (x, y) => x.Address.StreetName());

            RuleFor(x => x.Subdivision, (x, y) => x.Lorem.Slug(2));

            RuleFor(x => x.District, (x, y) => x.Lorem.Word());

            RuleFor(x => x.Municipality, (x, y) => x.Lorem.Word());

            RuleFor(x => x.Province, (x, y) => x.Lorem.Word());

            RuleFor(x => x.Country, (x, y) => x.Address.Country());

            RuleFor(x => x.ZipCode, (x, y) => x.Address.ZipCode());
        }
    }

    public class AddressProfile : Profile
    {
        public AddressProfile()
        {
            CreateMap<Models.Address, Dtos.Address>().ReverseMap();
        }
    }
}

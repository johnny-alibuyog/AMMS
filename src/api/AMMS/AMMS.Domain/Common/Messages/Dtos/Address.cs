using AutoMapper;
using FluentValidation;

namespace AMMS.Domain.Common.Messages.Dtos
{
    public class Address
    {
        public string Street { get; set; }

        public string Barangay { get; set; }

        public string City { get; set; }

        public string Province { get; set; }

        public string Region { get; set; }

        public string Country { get; set; }

        public string ZipCode { get; set; }
    }

    public class AddressValidator : AbstractValidator<Address>
    {
        public AddressValidator()
        {
            RuleFor(x => x.Street);

            RuleFor(x => x.Barangay);

            RuleFor(x => x.City);

            RuleFor(x => x.Province);

            RuleFor(x => x.Region);

            RuleFor(x => x.Country);

            RuleFor(x => x.ZipCode);
        }
    }

    public class AddressProfile : Profile
    {
        public AddressProfile()
        {
            CreateMap<Models.Address, Dtos.Address>();
        }
    }
}

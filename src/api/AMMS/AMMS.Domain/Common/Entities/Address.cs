using MongoDB.Bson.Serialization;
using System;

namespace AMMS.Domain.Common.Entities
{
    public class Address
    {
        public string Street { get; private set; }

        public string Barangay { get; private set; }

        public string City { get; private set; }

        public string Province { get; private set; }

        public string Region { get; private set; }

        public string Country { get; private set; }

        public string ZipCode { get; private set; }

        public Address(
            string street, 
            string barangay, 
            string city, 
            string province, 
            string region, 
            string country, 
            string zipCode)
        {
            this.Street = street;
            this.Barangay = barangay;
            this.City = city;
            this.Province = province;
            this.Region = region;
            this.Country = country;
            this.ZipCode = zipCode;
        }
    }

    public static class AddressMap
    {
        public static Action<BsonClassMap<Address>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.Street);

            map.MapMember(x => x.Barangay);

            map.MapMember(x => x.City);

            map.MapMember(x => x.Province);

            map.MapMember(x => x.Region);

            map.MapMember(x => x.Country);

            map.MapMember(x => x.ZipCode);

            map.MapCreator(x => 
                new Address(
                    x.Street, 
                    x.Barangay,
                    x.City,
                    x.Province,
                    x.Region,
                    x.Country,
                    x.ZipCode
                )
            );
        };
    }
}

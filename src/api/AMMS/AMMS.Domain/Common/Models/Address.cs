using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;

namespace AMMS.Domain.Common.Models
{
    /// <summary>
    /// https://en.wikipedia.org/wiki/Postal_addresses_in_the_Philippines
    /// </summary>
    public class Address : ValueObject<Address>
    {
        /// <summary>
        /// Unit Number + House/Building/Street Number
        /// </summary>
        public string Unit { get; set; }

        /// <summary>
        /// Street Name
        /// </summary>
        public string Street { get; private set; }

        /// <summary>
        /// Subdivision/Village
        /// </summary>
        public string Subdivision { get; private set; }

        /// <summary>
        /// Barangay/District Name
        /// </summary>
        public string District { get; private set; }

        /// <summary>
        /// City/Municipality
        /// </summary>
        public string Municipality { get; private set; }

        /// <summary>
        /// Province/Metro Manila
        /// </summary>
        public string Province { get; private set; }

        /// <summary>
        /// Ex. Philippines
        /// </summary>
        public string Country { get; private set; }

        /// <summary>
        /// Postal Code/Postal Code
        /// </summary>
        public string ZipCode { get; private set; }

        public Address(
            string unit,
            string street,
            string subdivision,
            string district, 
            string municipality, 
            string province, 
            string country, 
            string zipCode)
        {
            Unit = unit;
            Street = street;
            Subdivision = subdivision;
            District = district;
            Municipality = municipality;
            Province = province;
            Country = country;
            ZipCode = zipCode;
        }
    }

    public class AddressMap : ClassMap<Address>
    {
        public override void Map(BsonClassMap<Address> cm)
        {
            cm.AutoMap();

            cm.MapMember(x => x.Unit);

            cm.MapMember(x => x.Street);

            cm.MapMember(x => x.Subdivision);

            cm.MapMember(x => x.District);

            cm.MapMember(x => x.Municipality);

            cm.MapMember(x => x.Province);

            cm.MapMember(x => x.Country);

            cm.MapMember(x => x.ZipCode);

            cm.MapCreator(x =>
                new Address(
                    x.Unit,
                    x.Street,
                    x.Subdivision,
                    x.District,
                    x.Municipality,
                    x.Province,
                    x.Country,
                    x.ZipCode
                )
            );
        }
    }
}

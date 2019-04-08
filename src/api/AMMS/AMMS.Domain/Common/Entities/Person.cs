using MongoDB.Bson.Serialization;
using System;

namespace AMMS.Domain.Common.Entities
{
    public class Person
    {
        public string FirstName { get; protected set; }

        public string LastName { get; protected set; }

        public string MiddleName { get; protected set; }

        public Nullable<DateTime> BirthDate { get; protected set; }

        public static string Fullname(Person person) => person.FirstName + " " + person.LastName;

        public Person(
            string firstName, 
            string lastName, 
            string middleName, 
            DateTime? birthDate)
        {
            this.FirstName = firstName;
            this.LastName = lastName;
            this.MiddleName = middleName;
            this.BirthDate = birthDate;
        }
    }

    public static class PersonMap
    {
        public static Action<BsonClassMap<Person>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.FirstName)
                .SetIsRequired(true);

            map.MapMember(x => x.MiddleName);

            map.MapMember(x => x.LastName)
                .SetIsRequired(true);

            map.MapMember(x => x.BirthDate);

            map.MapCreator(x =>
                new Person(
                    x.FirstName,
                    x.MiddleName,
                    x.LastName,
                    x.BirthDate
                )
            );
        };
    }
}

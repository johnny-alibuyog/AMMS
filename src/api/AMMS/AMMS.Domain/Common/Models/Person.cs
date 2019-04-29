using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;
using System;

namespace AMMS.Domain.Common.Models
{
    public enum Gender
    {
        Male,
        Female
    }

    public class Person : ValueObject<Person>
    {
        public string FirstName { get; protected set; }

        public string LastName { get; protected set; }

        public string MiddleName { get; protected set; }

        public Gender? Gender { get; protected set; }

        public DateTime? BirthDate { get; protected set; }

        public static string Fullname(Person person) => person.FirstName + " " + person.LastName;

        public Person(
            string firstName, 
            string lastName, 
            string middleName, 
            Gender? gender,
            DateTime? birthDate)
        {
            FirstName = firstName;
            LastName = lastName;
            MiddleName = middleName;
            Gender = gender;
            BirthDate = birthDate;
        }
    }

    public class PersonMap : ClassMap<Person>
    {
        public override void Map(BsonClassMap<Person> cm)
        {
            cm.AutoMap();

            cm.MapMember(x => x.FirstName)
                .SetIsRequired(true);

            cm.MapMember(x => x.MiddleName);

            cm.MapMember(x => x.LastName)
                .SetIsRequired(true);

            cm.MapMember(x => x.Gender);

            cm.MapMember(x => x.BirthDate);

            cm.MapCreator(x =>
                new Person(
                    x.FirstName,
                    x.LastName,
                    x.MiddleName,
                    x.Gender,
                    x.BirthDate
                )
            );
        }
    }
}

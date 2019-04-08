using AMMS.Domain.Common.Entities;
using MongoDB.Bson.Serialization;

namespace AMMS.Domain.Common
{
    public class CommonContext
    {
        static CommonContext()
        {
            BsonClassMap.RegisterClassMap(AddressMap.Map);
            BsonClassMap.RegisterClassMap(PersonMap.Map);
        }
    }
}

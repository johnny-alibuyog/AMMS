using AMMS.Domain.Common.Kernel;
using AMMS.Domain.Common.Models;
using MongoDB.Bson.Serialization;

namespace AMMS.Domain.Common
{
    public class CommonContext
    {
        static CommonContext()
        {
            BsonClassMap.RegisterClassMap(EntityMap.Map);
            BsonClassMap.RegisterClassMap(TenantMap.Map);
            BsonClassMap.RegisterClassMap(BranchMap.Map);
            BsonClassMap.RegisterClassMap(AddressMap.Map);
            BsonClassMap.RegisterClassMap(PersonMap.Map);
        }
    }
}

using AutoMapper;
using static AMMS.Domain.Membership.Messages.Tenants.TenantCreate;

namespace AMMS.Test.Integration
{
    public class MapperProvider
    {
        private static readonly IMapper _instance = CreateMapper();

        public static IMapper GetMapper() => _instance;

        private static IMapper CreateMapper() => new MapperConfiguration(x => x.AddProfiles(typeof(TransformProfile).Assembly)).CreateMapper();
    }
}

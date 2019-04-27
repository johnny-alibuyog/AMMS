using AMMS.Service.Client;

namespace AMMS.Test.Integration
{
    public class FeatureBase
    {
        protected readonly Api _api = ApiProvider.GetInstance();
    }
}

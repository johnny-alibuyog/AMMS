using TechTalk.SpecFlow;

namespace AMMS.Test.Integration.Utils
{
    public class CrudStateContainer<TId, TModel>
    {
        private readonly ScenarioContext _keyValues;

        public CrudStateContainer(ScenarioContext keyValues) => _keyValues = keyValues;

        public string Id
        {
            get => (string)_keyValues[$"{GetType()}_{nameof(Id)}"];
            set => _keyValues[$"{GetType()}_{nameof(Id)}"] = value;
        }

        public TModel Inserting
        {
            get => (TModel)_keyValues[$"{GetType()}_{nameof(Inserting)}"];
            set => _keyValues[$"{GetType()}_{nameof(Inserting)}"] = value;
        }


        public TModel Inserted
        {
            get => (TModel)_keyValues[$"{GetType()}_{nameof(Inserted)}"];
            set => _keyValues[$"{GetType()}_{nameof(Inserted)}"] = value;
        }

        public TModel Updating
        {
            get => (TModel)_keyValues[$"{GetType()}_{nameof(Updating)}"];
            set => _keyValues[$"{GetType()}_{nameof(Updating)}"] = value;
        }

        public TModel Updated
        {
            get => (TModel)_keyValues[$"{GetType()}_{nameof(Updated)}"];
            set => _keyValues[$"{GetType()}_{nameof(Updated)}"] = value;
        }
    }
}

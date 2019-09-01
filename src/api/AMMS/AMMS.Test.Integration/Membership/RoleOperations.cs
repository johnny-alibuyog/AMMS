using AMMS.Domain;
using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Domain.Membership.Messages.Roles;
using AMMS.Service.Host.Common.Client;
using AMMS.Test.Integration.Utils;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace AMMS.Test.Integration.Membership
{
    [Binding]
    public class RoleOperations
    {
        private ClientApi _api;

        private readonly CrudStateContainer<string, Role> _state;

        private readonly FakerContext _faker;

        private DummyEnvironment _env;

        public RoleOperations(ScenarioContext scenarioContext)
        {
            _state = new CrudStateContainer<string, Role>(scenarioContext);
            _faker = new FakerContext();
        }

        [Before("RoleCrud")]
        public async Task Before()
        {
            _env = new DummyEnvironment();

            await _env.Initialize();

            _api = ClientApiProvider.CreateClientApi(_env);
        }

        [After("RoleCrud")]
        public async Task After()
        {
            await _env.Clean();
        }

        [Given(@"a role has been created")]
        public async Task GivenARoleHasBeenCreated()
        {
            var request = new RoleCreate.Request()
            {
                Name = "Some Role",
                Permissions = _faker.Membership.Permission.Generate(3)
            };

            var response = await _api.Membership.Roles.Send(request);

            var inserted = await _api.Membership.Roles.Send(new RoleGet.Request() { Id = response.Id });

            _state.Id = response.Id;

            _state.Inserting = request;

            _state.Inserted = inserted;
        }

        [When(@"the role is updated")]
        public async Task WhenTheRoleIsUpdated()
        {
            var request = new RoleUpdate.Request()
            {
                Id = _state.Inserted.Id,
                Name = _state.Inserted.Name + "_Updated",
                Permissions = _faker.Membership.Permission.Generate(4)
            };

            await _api.Membership.Roles.Send(request);

            var updated = await _api.Membership.Roles.Send(new RoleGet.Request() { Id = _state.Inserted.Id });

            _state.Updating = request;

            _state.Updated = updated;
        }

        [Then(@"the role reflects the changes")]
        public void ThenTheRoleReflectsTheChanges()
        {
            Assert.AreEqual(_env.Tenant.Id, _state.Inserted.TenantId);
            Assert.AreEqual(_state.Inserting.Name, _state.Inserted.Name);
            Assert.AreEqual(_state.Updating.Name, _state.Updated.Name);
            Assert.AreNotEqual(_state.Updated.Name, _state.Inserted.Name);
            Assert.IsTrue(CollectionAreEqual(_state.Inserting.Permissions, _state.Inserted.Permissions));
            Assert.IsTrue(CollectionAreEqual(_state.Updating.Permissions, _state.Updated.Permissions));
            Assert.IsFalse(CollectionAreEqual(_state.Updated.Permissions, _state.Inserted.Permissions));

            bool CollectionAreEqual(IEnumerable<Permission> permissions1, IEnumerable<Permission> permissions2)
            {
                var sortedPermissions1 = permissions1.OrderBy(x => x.Area).ToList();

                var sorderPermissions2 = permissions2.OrderBy(x => x.Area).ToList();

                var areas1 = sortedPermissions1.Select(x => x.Area).ToList();

                var areas2 = sorderPermissions2.Select(x => x.Area).ToList();

                for (int i = 0; i < sortedPermissions1.Count; i++)
                {
                    if (areas1[i] != areas2[i])
                    {
                        return false;
                    }

                    var access1 = sortedPermissions1[i].AccessRights.OrderBy(x => x).ToList();

                    var access2 = sorderPermissions2[i].AccessRights.OrderBy(x => x).ToList();

                    for (int j = 0; j < access1.Count; j++)
                    {
                        if (access1[j] != access2[j])
                        {
                            return false;
                        }
                    }
                }

                return true;
            }
        }

        [Then(@"the role is deletable")]
        public void ThenTheRoleIsDeletable()
        {
            Assert.DoesNotThrowAsync(async () => await _api.Membership.Roles.Send(new RoleDelete.Request() { Id = _state.Id }));
        }
    }
}

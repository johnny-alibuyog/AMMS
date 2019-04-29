using AMMS.Domain.Membership.Messages.Branches;
using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Domain.Membership.Messages.Tenants;
using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Client;
using System;
using System.Threading.Tasks;

namespace AMMS.Test.Integration.Utils
{
    public class DummyEnvironment : IDisposable
    {
        private readonly Api _api;

        public Tenant Tenant { get; private set; }

        public Branch Branch { get; private set; }

        public User User { get; private set; }

        public DummyEnvironment(Api api)
        {
            _api = api;
        }

        public async Task Clean()
        {
            await _api.Membership.Users.Send(new UserDelete.Request() { Id = User.Id });
            await _api.Membership.Branches.Send(new BranchDelete.Request() { Id = User.Id });
            await _api.Membership.Tenants.Send(new TenantDelete.Request() { Id = User.Id });
        }

        public void Dispose()
        {
            Clean().Wait();
        }
    }

    public interface IDummyEnvironmentBuilder
    {
        IDummyEnvironmentBuilder WithDummyTenant(Tenant tenant = null);
        IDummyEnvironmentBuilder WithDummyBranch(Branch brancy = null);
        IDummyEnvironmentBuilder WithDummyUser(User user = null);
        Task<DummyEnvironment> Create();
    }

    //public class DummyEnvironmentBuilder : IDummyEnvironmentBuilder
    //{
    //    private readonly IMapper _mapper;
    //    private readonly Faker _faker;
    //    private readonly Api _api;
    //    private TenantCreate.Request _createTenantRequest;
    //    private BranchCreate.Request _createBranchRequest;
    //    private UserCreate.Request _createUserRequest;

    //    private DummyEnvironmentBuilder(Api api, IMapper mapper = null)
    //    {
    //        _mapper = mapper ?? MapperProvider.GetMapper();
    //        _faker = new Faker();
    //        _api = api;
    //    }

    //    public static IDummyEnvironmentBuilder Initialize(Api api)
    //    {
    //        return new DummyEnvironmentBuilder(api);
    //    }

    //    public IDummyEnvironmentBuilder WithDummyTenant(Tenant tenant = null)
    //    {
    //        var request = _mapper.Map<TenantCreate.Request>(tenant ?? new Tenant()
    //        {
    //            Name = _faker.Company.CompanyName()
    //        });

    //        var response = _api.Tenants.Send(request).Result;
    //        return this;
    //    }


    //    public IDummyEnvironmentBuilder WithDummyBranch(Branch branch = null)
    //    {
    //        _branch = branch;
    //        return this;
    //    }

    //    public IDummyEnvironmentBuilder WithDummyUser(User user = null)
    //    {
    //        _user = user;
    //        return this;
    //    }

    //    public async Task<DummyEnvironment> Create()
    //    {

    //        _branch = _branch ?? new Branch()
    //        {

    //        };


    //        return new DummyEnvironment(

    //        );
    //    }

    //    public async Task PersistTenant()
    //    {
    //        _tenant = _tenant ?? new Tenant()
    //        {
    //            Name = _faker.Company.CompanyName()
    //        };

    //        var request = _mapper.Map<TenantCreate.Request>(_tenant);

    //        var respone = await _api.Tenants.Send(request);

    //        _tenant = await _api.Tenants.Send(new TenantGet.Request() { Id = respone.Id });
    //    }

    //    public async Task PersistBranch()
    //    {
    //    }
    //}
}

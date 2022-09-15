using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AutoMapper;
using Bogus;
using FluentValidation;

namespace AMMS.Domain.Membership.Messages.Dtos;

public class TenantUserSettings : Equatable<TenantUserSettings>
{
    public string TenantId { get; set; }

    public string DefaultPassword { get; set; }
}

public class TenantUserSettingsValidator : AbstractValidator<TenantUserSettings>
{
    public TenantUserSettingsValidator()
    {
        RuleFor(x => x.TenantId);

        RuleFor(x => x.DefaultPassword).NotNull().NotEmpty();
    }
}

public class TenantUserSettingsFaker : Faker<TenantUserSettings>
{
    public TenantUserSettingsFaker()
    {
        RuleFor(x => x.DefaultPassword, (x, y) => new PasswordGenerator().Generate());
    }
}

public class TenantUserSettingsProfile : Profile
{
    public TenantUserSettingsProfile()
    {
        CreateMap<Models.TenantUserSettings, Dtos.TenantUserSettings>().ReverseMap();
    }
}

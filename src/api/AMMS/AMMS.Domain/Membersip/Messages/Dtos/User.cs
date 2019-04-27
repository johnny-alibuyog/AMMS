﻿using AMMS.Domain.Common.Messages.Dtos;
using AutoMapper;
using FluentValidation;
using System.Collections.Generic;

namespace AMMS.Domain.Membership.Messages.Dtos
{
    public class User
    {
        public string Id { get; set; }

        public string TenantId { get; set; }

        public string Username { get; set; }

        public Person Person { get; set; }

        public Address HomeAddress { get; set; }

        public List<string> RoleIds { get; set; }

        public List<string> BranchIds { get; set; }
    }

    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator(PersonValidator personValidator, AddressValidator addressValidator)
        {
            RuleFor(x => x.Id);

            RuleFor(x => x.TenantId);

            RuleFor(x => x.Username)
                .NotNull().NotEmpty();

            RuleFor(x => x.Person)
                .NotNull().SetValidator(personValidator);

            RuleFor(x => x.HomeAddress)
                .NotNull().SetValidator(addressValidator);

            RuleFor(x => x.RoleIds)
                .NotEmpty();

            RuleFor(x => x.BranchIds);
        }
    }

    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<Dtos.User, Models.User>()
                .ForMember(x => x.PasswordHash, x => x.Ignore())
                .ForMember(x => x.PasswordSalt, x => x.Ignore());
        }
    }
}
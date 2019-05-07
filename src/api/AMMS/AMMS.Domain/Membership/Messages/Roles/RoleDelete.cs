﻿using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Roles
{
    public class RoleDelete
    {
        public class Request : WithStringId, IRequest<Response> { }

        public class Response { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.Role, Access.Delete));
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                await Db.Membership.Roles.DeleteOneAsync(x => x.Id == request.Id, cancellationToken);

                return new Response();
            }
        }
    }
}
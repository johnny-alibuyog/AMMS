using AMMS.Domain.Common.Pipes.Auth;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace AMMS.Service.Host.Common.Auth
{
    public class BearerTokenExtractor : ITokenExtractor
    {
        private readonly IHttpContextAccessor _contextAccessor;

        public BearerTokenExtractor(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }

        public Token Extract()
        {
            var authHeader = _contextAccessor.HttpContext.Request.Headers["Authorization"];

            if (authHeader.Count == 0)
            {
                return null;
            }

            return authHeader.ToString().Split(" ").LastOrDefault();
        }
    }
}

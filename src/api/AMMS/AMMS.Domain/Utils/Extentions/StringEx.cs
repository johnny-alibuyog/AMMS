using System;

namespace AMMS.Domain.Utils.Extentions
{
    public static class StringEx
    {
        public static string ToCamelCase(this string value)
        {
            if (!string.IsNullOrEmpty(value) && value.Length > 1)
            {
                return Char.ToLowerInvariant(value[0]) + value.Substring(1);
            }
            return value;
        }
    }
}

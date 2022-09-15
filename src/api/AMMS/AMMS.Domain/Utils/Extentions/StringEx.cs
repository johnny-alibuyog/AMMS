using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;

namespace AMMS.Domain.Utils.Extentions;

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

    static string ToQueryString(this object o)
    {
        return string.Join(
            separator: "&",
            values: o.ToPropertyDictionary()
                .Where(x => x.Value != null)
                .Select(x => $"{x.Key}={Encode(x.Value)}")
        );

        string Encode(object complexType) => WebUtility.UrlEncode(complexType.ToString());
    }

    private static Dictionary<string, object> ToPropertyDictionary(this object complex)
    {
        return complex.GetType()
            .GetProperties(BindingFlags.Public | BindingFlags.Instance)
           .ToDictionary(p => p.Name, p => p.GetValue(complex));
    }
}

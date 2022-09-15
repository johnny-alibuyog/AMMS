using System;
using System.Collections.Generic;
using System.Linq;

namespace AMMS.Domain.Utils.Extentions;

public static class EnumEx
{
    public static TDestination Map<TSource, TDestination>(this TSource source) 
        where TSource : struct 
        where TDestination : struct
    {
        return Enum.TryParse<TDestination>(source.ToString(), out var result)
            ? result : default(TDestination);
    }

    public static IEnumerable<TEnum> GetList<TEnum>() where TEnum : struct
    {
        return Enum.GetValues(typeof(TEnum)).Cast<TEnum>();
    }
}

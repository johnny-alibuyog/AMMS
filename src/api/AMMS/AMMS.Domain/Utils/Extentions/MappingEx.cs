using AutoMapper;

namespace AMMS.Domain.Utils.Extentions
{
    internal static class MappingEx
    {
        public static TDestination MapTo<TSource, TDestination>(this TSource source, TDestination destination = null)
            where TSource : class
            where TDestination : class
        {
            if (source == null)
                return null;

            return (destination != null)
                ? Mapper.Map<TSource, TDestination>(source, destination)
                : Mapper.Map<TSource, TDestination>(source);
        }

        public static TDestination MapFrom<TSource, TDestination>(this TDestination destination, TSource source)
            where TSource : class
            where TDestination : class
        {
            if (source == null)
                return null;

            return (destination != null)
                ? Mapper.Map<TSource, TDestination>(source, destination)
                : Mapper.Map<TSource, TDestination>(source);
        }
    }
}

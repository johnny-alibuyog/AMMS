using System;
using System.Collections.Generic;
using System.Reflection;

namespace AMMS.Domain.Common.Kernel
{
    public abstract class ValueObject<T> : IEquatable<T> where T : ValueObject<T>
    {
        private static IDictionary<Type, FieldInfo[]> _fieldInfos = new Dictionary<Type, FieldInfo[]>();

        private FieldInfo[] Fields
        {
            get
            {
                if (!_fieldInfos.ContainsKey(this.GetType()))
                {
                    var bindingFlag = BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public;
                    _fieldInfos[this.GetType()] = this.GetType().GetFields(bindingFlag);
                }

                return _fieldInfos[this.GetType()];
            }
        }

        public override bool Equals(object obj)
        {
            if (obj == null)
                return false;

            var other = obj as T;

            return Equals(other);
        }

        public override int GetHashCode()
        {
            var fields = GetFields();
            var startValue = 17;
            var multiplier = 59;

            var hashCode = startValue;

            foreach (var field in fields)
            {
                var value = field.GetValue(this);

                if (value != null)
                    hashCode = hashCode * multiplier + value.GetHashCode();
            }

            return hashCode;
        }

        public virtual bool Equals(T other)
        {
            if (other == null)
                return false;

            var type = this.GetType();
            var otherType = other.GetType();

            if (type != otherType)
                return false;

            foreach (var field in this.Fields)
            {
                var value1 = field.GetValue(other);
                var value2 = field.GetValue(this);

                if (value1 == null)
                {
                    if (value2 != null)
                        return false;
                }
                else if (!value1.Equals(value2))
                    return false;
            }

            return true;
        }

        private IEnumerable<FieldInfo> GetFields()
        {
            var type = GetType();
            var fields = new List<FieldInfo>();

            while (type != typeof(object))
            {
                fields.AddRange(type.GetFields(BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public));

                type = type.BaseType;
            }

            return fields;
        }

        public static bool operator ==(ValueObject<T> x, ValueObject<T> y) => Equals(x, y);

        public static bool operator !=(ValueObject<T> x, ValueObject<T> y) => !(x == y);
    }
}

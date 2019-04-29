using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;

namespace AMMS.Domain.Common.Messages.Dtos
{
    public abstract class Equatable<T> : IEquatable<T> where T : Equatable<T>
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

        public void Set<TField>(Expression<Func<T, TField>> selector, TField value)
        {
            var prop = (PropertyInfo)((MemberExpression)selector.Body).Member;
            prop.SetValue(this, value);
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

                if (value1 == null && value2 != null)
                {
                    return false;
                }
                else if (!value1.Equals(value2))
                {
                    return false;
                }
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

        public override string ToString()
        {
            var stringValue = $"{GetType().Name}";

            foreach (var field in this.Fields)
            {
                var value = field.GetValue(this);

                stringValue += $"{Environment.NewLine}{field.Name}: " + ((value != null) ? value.ToString() : string.Empty);
            }

            return stringValue;
        }

        public static bool operator ==(Equatable<T> x, Equatable<T> y) => Equals(x, y);

        public static bool operator !=(Equatable<T> x, Equatable<T> y) => !(x == y);
    }
}
using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;

namespace AMMS.Domain.Common.Kernel
{
    public abstract class ValueObject<T> : IEquatable<T> where T : ValueObject<T>
    {
        private static ConcurrentDictionary<Type, FieldInfo[]> _fieldInfos = new ConcurrentDictionary<Type, FieldInfo[]>();

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
            var thisType = this?.GetType();
            var otherType = other?.GetType();

            if (otherType == null || thisType != otherType)
            {
                return false;
            }

            foreach (var field in this.Fields)
            {
                var thisValue = field.GetValue(this);
                var otherValue = field.GetValue(other);


                if (otherValue == null && thisValue != null)
                {
                    return false;
                }
                else if (
                    otherValue is IEnumerable otherItems && !(otherValue is string) &&
                    thisValue is IEnumerable thisItems && !(thisValue is string))
                {
                    var thisEnumerator = thisItems.GetEnumerator();
                    var otherEnumerator = otherItems.GetEnumerator();

                    var thisHasValue = false;
                    var otherHasValue = false;

                    do
                    {
                        thisHasValue = thisEnumerator.MoveNext();
                        otherHasValue = otherEnumerator.MoveNext();

                        if (thisHasValue != otherHasValue)
                        {
                            return false;
                        }

                        if (thisEnumerator.Current.ToString() != otherEnumerator.Current.ToString())
                        {
                            return false;
                        }
                    }
                    while (thisHasValue && otherHasValue);
                }
                else if (!otherValue.Equals(thisValue))
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

        public static bool operator ==(ValueObject<T> x, ValueObject<T> y) => Equals(x, y);

        public static bool operator !=(ValueObject<T> x, ValueObject<T> y) => !(x == y);
    }
}

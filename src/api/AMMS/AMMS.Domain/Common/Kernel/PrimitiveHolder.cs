using System;
using System.Collections.Generic;
using System.Text;

namespace AMMS.Domain.Common.Kernel
{
    /// Reference: https://lucax88x.github.io/2016/11/21/2016-11-21-primitive-obsession/
    public class PrimitiveHolder<T>
    {
        public T Value { get; private set; }

        public PrimitiveHolder(T value) => this.Value = value;
    }
}

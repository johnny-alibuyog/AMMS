using AMMS.Domain.Common.Messages.Dtos;

namespace AMMS.Domain.Common
{
    public class CommonFakerContext
    {
        public AddressFaker Address { get; }

        public PersonFaker Person { get; }

        public CommonFakerContext()
        {
            Address = new AddressFaker();

            Person = new PersonFaker();
        }
    }
}

namespace AMMS.Domain.Common.Messages
{
    public class Lookup<TId> 
    {
        public TId Id { get; set; }

        public string Name { get; set; }
    }
}

using System.Threading.Tasks;

namespace AMMS.Domain.Utils.Extentions
{
    public static class TaskEx
    {
        public static T SyncResult<T>(this Task<T> task)
        {
            task.RunSynchronously();
            return task.Result;
        }
    }
}

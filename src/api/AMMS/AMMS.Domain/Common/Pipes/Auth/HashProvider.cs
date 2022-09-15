using System;
using System.Security.Cryptography;
using System.Text;

namespace AMMS.Domain.Common.Pipes.Auth
{
    public interface IHashProvider
    {
        (byte[] hash, byte[] salt) GenerateHashAndSalt(byte[] data);

        (string hash, string salt) GenerateHashAndSaltString(string data);

        bool VerifyHash(byte[] data, byte[] hash, byte[] salt);

        bool VerifyHashString(string data, string hash, string salt);
    }

    public class HashProvider : IHashProvider
    {
        private readonly int _salthLength;

        private readonly HashAlgorithm _hashAlgorithm;

        public static IHashProvider New() => new HashProvider();

        public HashProvider() : this(SHA256.Create(), 4) { }

        public HashProvider(HashAlgorithm hashAlgorithm, int saltLength)
        {
            _hashAlgorithm = hashAlgorithm;
            _salthLength = saltLength;
        }

        private byte[] ComputeHash(byte[] data, byte[] salt)
        {
            byte[] buffer = new byte[data.Length + _salthLength];
            Array.Copy(data, buffer, data.Length);
            Array.Copy(salt, 0, buffer, data.Length, _salthLength);
            return _hashAlgorithm.ComputeHash(buffer);
        }

        public (byte[] hash, byte[] salt) GenerateHashAndSalt(byte[] data)
        {
            var salt = new byte[_salthLength];
            using var rnd = RandomNumberGenerator.Create();
            rnd.GetNonZeroBytes(salt);
            var hash = ComputeHash(data, salt);
            return (hash, salt);
        }

        public (string hash, string salt) GenerateHashAndSaltString(string data)
        {
            var (hashByte, saltByte) = GenerateHashAndSalt(Encoding.UTF8.GetBytes(data));
            var hash = Convert.ToBase64String(hashByte);
            var salt = Convert.ToBase64String(saltByte);
            return (hash, salt);
        }

        public bool VerifyHash(byte[] data, byte[] hash, byte[] salt)
        {
            var computedHash = ComputeHash(data, salt);
            if (computedHash.Length != hash.Length)
                return false;
            for (int index = 0; index < hash.Length; ++index)
            {
                if (!hash[index].Equals(computedHash[index]))
                    return false;
            }
            return true;
        }

        public bool VerifyHashString(string data, string hash, string salt)
        {
            var hash1 = Convert.FromBase64String(hash);
            var salt1 = Convert.FromBase64String(salt);
            return VerifyHash(Encoding.UTF8.GetBytes(data), hash1, salt1);
        }
    }

}

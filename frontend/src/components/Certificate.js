export default function CertificateCard({ cert }) {
  if (!cert) return null;

  const tokenId = cert.blockchainTokenId;
  const verifyUrl = `${window.location.origin}/verify/${tokenId}`;

  return (
    <div className="border-2 border-white flex flex-col h-80 p-8 mb-6 text-center">

      <h4 className="text-white text-4xl font-forum border-b-2 border-white pb-2">
        {cert.subject}
      </h4>

      <p className="text-white text-2xl mt-6">
        {cert.studentNameSnapshot}
      </p>

      <p className="text-white text-lg mt-auto">
        Issued on: {new Date(cert.dateOfIssue).toLocaleDateString()}
      </p>

      <button
        onClick={() => window.open(verifyUrl, "_blank")}
        className="mt-4 border border-white text-white px-4 py-2 rounded"
      >
        Verify Certificate
      </button>
    </div>
  );
}

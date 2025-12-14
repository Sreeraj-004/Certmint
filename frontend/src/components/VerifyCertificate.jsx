import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import CertificateABI from "../abi/CertificateNFT.json";


const CONTRACT_ADDRESS = "0x560F59d11712BacF6F9B44db863db123F331D4eA";
const SEPOLIA_RPC = "https://eth-sepolia.g.alchemy.com/v2/gm1tQdRrm-OjaEoZh4iSk";

export default function VerifyCertificate() {
  const { tokenId } = useParams();
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    async function verify() {
      try {
        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CertificateABI.abi,
          provider
        );

        const isValid = await contract.isValid(tokenId);
        if (!isValid) {
          setStatus("revoked");
          return;
        }

        const [, issuer, uri] = await contract.getCertificate(tokenId);

        const base64 = uri.split(",")[1];
        const decoded = JSON.parse(atob(base64));

        setData({ issuer, ...decoded });
        setStatus("valid");
      } catch (err) {
        setStatus("invalid");
      }
    }

    verify();
  }, [tokenId]);

  if (status === "loading") return <p>Verifying...</p>;
  if (status === "invalid") return <p>❌ Invalid Certificate</p>;
  if (status === "revoked") return <p>⚠️ Certificate Revoked</p>;

  return (
    <div>
      <h1>✅ Certificate Verified</h1>
      <p><b>Subject:</b> {data.subject}</p>
      <p><b>Student:</b> {data.studentName}</p>
      <p><b>Email:</b> {data.studentEmail}</p>
      <p><b>Issued At:</b> {data.issuedAt}</p>
      <p><b>Issuer:</b> {data.issuer}</p>
      <p><b>Token ID:</b> {tokenId}</p>
    </div>
  );
}

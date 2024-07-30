"use client";
import Image from "next/image";
import {
  ClaimButton,
  ConnectButton,
  MediaRenderer,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from "thirdweb/react";
import {
  createThirdwebClient,
  defineChain,
  getContract,
  NFT,
  ThirdwebClient,
} from "thirdweb";
import { polygon, sepolia } from "thirdweb/chains";
import { inAppWallet, Wallet } from "thirdweb/wallets";
import { client } from "./client";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { useState } from "react";

export default function Home() {
  const account = useActiveAccount();
  return (
    <main className="bg-cover bg-landing-bg bg-center min-h-screen">
      {!account ? (
        <div className="flex justify-center items-center pt-96">
          <SignInComponents />
        </div>
      ) : (
        <div className="flex pt-40">
          <MintArea />
        </div>
      )}

      <div></div>

      {/* <footer className="flex pt-10 justify-center align-bottom">
        <ThirdwebResources />
      </footer> */}
    </main>
  );
}

function SignInComponents() {
  const client = createThirdwebClient({
    clientId: "9dfc4fc428f0f902ff4178b712fd1104",
  });
  const wallet = inAppWallet({
    auth: {
      options: [
        "google",
        "apple",
        "facebook",
        "phone",
        "discord",
        "email",
        "farcaster",
      ],
    },
  });

  return (
    <div className="flex-row space-y-10">
      {/*Classic Connect Button*/}
      <div className="flex justify-center ">
        <ConnectButton client={client} chain={sepolia} />
      </div>
      {/*Social Login*/}
      <div>
        <ConnectButton
          client={client}
          chain={sepolia}
          wallets={[wallet]}
          connectButton={{ label: "Social Login" }}
        />
      </div>
    </div>
  );
}

function SignOutComponents() {
  const { disconnect } = useDisconnect();
  const activeWallet = useActiveWallet();

  return (
    <div className="flex justify-center py-5">
      {/* Sign Out Button */}
      <button
        className="bg-red-800 rounded-lg p-2 font-semibold px-5 py-2 text-white"
        onClick={() => {
          disconnect(activeWallet!);
        }}
      >
        Sign out
      </button>
    </div>
  );
}

function MintArea() {
  const [owned, setOwned] = useState<any>();
  const [display, setDisplay] = useState(false);
  const account = useActiveAccount();

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: "0x57d5E04D528DCBd13BC27CEFDF08C8bfbBcd8cdD",
  });

  const TraditionalClaim = () => {
    const number = Math.floor(Math.random() * 3);

    return (
      <ClaimButton
        contractAddress="0x57d5E04D528DCBd13BC27CEFDF08C8bfbBcd8cdD"
        chain={sepolia}
        client={client}
        claimParams={{
          type: "ERC1155",
          quantity: 1n,
          tokenId: BigInt(number),
        }}
      >
        Traditional Claim
      </ClaimButton>
    );
  };

  const ClaimWithPay = () => {
    return (
      <ClaimButton
        unstyled
        className="p-8 rounded-xl bg-green-800"
        contractAddress="0x564eB7D1DC5b098fD774E11c1960b425bfD96163"
        chain={polygon}
        client={client}
        claimParams={{
          type: "ERC1155",
          quantity: 1n,
          tokenId: BigInt(0),
        }}
        payModal={{
          metadata: {
            name: "Dino Drop",
            image: "./DinoEgg.jpg",
          },
        }}
      >
        Claim With Pay
      </ClaimButton>
    );
  };

  const viewOwned = async () => {
    const nfts = await getOwnedNFTs({
      contract:contract,
      start: 0,
      count: 10,
      address: account?.address!,
    });

    setOwned(nfts);
    setDisplay(true);
  };

  return (
    <div className="flex-row min-w-full justify-center">
      <SignOutComponents />

      <div className="flex bg-zinc-800 justify-center p-5 rounded-xl mx-40">
        <Image
          src={"/DinoEgg.jpg"}
          alt="officeHourNFT"
          width={"500"}
          height={"500"}
        />

        <div className="flex-col md:text-2xl justify-center text-sm p-5 space-y-5">
          <div className="flex justify-center">Claim Your Dino!</div>
          <div className="grid gap-4 lg:grid-cols-3 pt-5 justify-center">
            <ClaimWithPay />

            <TraditionalClaim />

            <button
              className="flex p-8 rounded-xl bg-green-800"
              onClick={() => viewOwned()}
            >
              View your Dinos
            </button>
          </div>
          {display && (
            <div className="max-h-7">
              {owned.map((item:any,index:any) => (
                <MediaRenderer
                  key={index}
                  client={client}
                  src={item.metadata.image}
                  style={{ maxHeight: "250px" }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div></div>
    </div>
  );
}

function ThirdwebResources() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 justify-center">
      <ArticleCard
        title="thirdweb SDK Docs"
        href="https://portal.thirdweb.com/typescript/v5"
        description="thirdweb TypeScript SDK documentation"
      />

      <ArticleCard
        title="Components and Hooks"
        href="https://portal.thirdweb.com/typescript/v5/react"
        description="Learn about the thirdweb React components and hooks in thirdweb SDK"
      />

      <ArticleCard
        title="thirdweb Dashboard"
        href="https://thirdweb.com/dashboard"
        description="Deploy, configure, and manage your smart contracts from the dashboard."
      />
    </div>
  );
}

function ArticleCard(props: {
  title: string;
  href: string;
  description: string;
}) {
  return (
    <a
      href={props.href + "?utm_source=next-template"}
      target="_blank"
      className="flex flex-col border border-zinc-800 bg-green-900 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
    >
      <article>
        <h2 className="text-lg font-semibold mb-2">{props.title}</h2>
        <p className="text-sm text-zinc-400">{props.description}</p>
      </article>
    </a>
  );
}

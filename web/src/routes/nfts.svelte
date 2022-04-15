<script lang="ts">
  import WalletAccess from '$lib/blockchain/WalletAccess.svelte';
  import NavButton from '$lib/components/styled/navigation/NavButton.svelte';
  import {nftsof} from '$lib/stores/nftsof';
  import {wallet, flow, chain} from '$lib/blockchain/wallet';
  import {onMount} from 'svelte';
  import Erc721TokenUri from '$lib/components/ERC721TokenURI.svelte';

  $: nfts = nftsof($wallet.address);

  let tokenID: string | undefined;
  let contractAddress: string | undefined;

  onMount(() => {
    const str = typeof location !== 'undefined' ? location.hash.substr(1) : '';
    if (str) {
      const splited = str.split('_');
      contractAddress = splited[0];
      tokenID = splited[1];
    }
    console.log({tokenID});
  });
</script>

{#if tokenID}
  <Erc721TokenUri {contractAddress} {tokenID} />
{:else}
  <WalletAccess>
    {#if $wallet.state !== 'Ready'}
      <div class="w-full h-full mx-auto flex items-center justify-center text-black dark:text-white ">
        <form class="mt-5 w-full max-w-sm">
          <div class="flex items-center">
            <NavButton
              label="Connect"
              disabled={$wallet.unlocking || $chain.connecting}
              on:click={() => flow.connect()}
            >
              Connect
            </NavButton>
          </div>
        </form>
      </div>
    {:else}
      <section class="py-8 px-4 w-full h-full mx-auto flex items-center justify-center text-black dark:text-white ">
        {#if $nfts.error}
          <div>Error: {$nfts.error}</div>
        {:else if $nfts.step === 'IDLE'}
          <div>NFTS not loaded</div>
        {:else if $nfts.step === 'LOADING'}
          <div>Loading NFTs...</div>
        {:else}
          <div class="w-full h-full grid sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 max-w-4xl mx-auto p-8">
            <!-- {JSON.stringify($nfts.data, null, 2)} -->
            {#each $nfts.data as nft, index}
              <div
                id={nft.id}
                class="rounded overflow-hidden shadow-lg h-40 border-gray-400 dark:border-gray-700 border-4 p-1 text-center flex items-center justify-center"
              >
                {#if nft.error}
                  Error:
                  {nft.error}
                {:else if nft.image}
                  <a href={`#${nft.id}`}>
                    <img
                      style="image-rendering: pixelated;"
                      class="object-contain h-full w-full"
                      alt={nft.name}
                      src={nft.image}
                    /></a
                  >
                {:else}
                  <p class="">{nft.name}</p>
                {/if}
              </div>
            {:else}You do not have any NFT{/each}
          </div>
        {/if}
      </section>
    {/if}
  </WalletAccess>
{/if}

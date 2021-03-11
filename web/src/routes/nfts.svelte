<script lang="ts">
  import WalletAccess from '../templates/WalletAccess.svelte';
  import NavButton from '../components/navigation/NavButton.svelte';
  import {nftsof} from '../stores/nftsof';
  import {wallet, flow, chain} from '../stores/wallet';

  $: nfts = nftsof($wallet.address);
</script>

<WalletAccess>
  <section class="py-8 px-4 text-black dark:text-white">
    {#if $nfts.state === 'Idle'}
      <div>NFTS not loaded</div>
    {:else if $nfts.error}
      <div>Error: {$nfts.error}</div>
    {:else if $nfts.state === 'Loading'}
      <div>Loading NFTs...</div>
    {:else}
      {#each $nfts.tokens as nft, index}
        {#if nft.error}
          Error for
          {nft.id}
        {:else}
          <div
            class="w-20 h-20 border-gray-400 dark:border-gray-700 border-4 p-1 text-center">
            <img
              style="image-rendering: pixelated;"
              class="object-contain h-full w-full"
              alt={nft.name}
              src={nft.image} />
          </div>
        {/if}
      {:else}You do not have any NFT{/each}
    {/if}
  </section>

  {#if $wallet.state === 'Ready'}
    <form class="mt-5 w-full max-w-sm">
      <div class="flex items-center">
        <NavButton
          label="Disconnect"
          disabled={$wallet.unlocking || $chain.connecting}
          on:click={() => wallet.disconnect()}>
          Disconnect
        </NavButton>
      </div>
    </form>
  {:else}
    <form class="mt-5 w-full max-w-sm">
      <div class="flex items-center">
        <NavButton
          label="Connect"
          disabled={$wallet.unlocking || $chain.connecting}
          on:click={() => flow.connect()}>
          Connect
        </NavButton>
      </div>
    </form>
  {/if}
</WalletAccess>

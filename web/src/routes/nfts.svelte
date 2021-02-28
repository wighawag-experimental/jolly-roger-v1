<script lang="ts">
  import WalletAccess from '../templates/WalletAccess.svelte';
  import NavButton from '../components/navigation/NavButton.svelte';
  import {nfts} from '../stores/nfts';
  import {wallet, flow, chain} from '../stores/wallet';

  nfts.fetch();
</script>

<WalletAccess>
  <section class="py-8 px-4">
    {#if !$nfts.state}
      <div>NFTS not loaded</div>
    {:else if $nfts.error}
      <div>Error: {$nfts.error}</div>
    {:else if $nfts.state === 'Fetching'}
      <div>Loading NFTs...</div>
    {:else if !$nfts.data}
      <div>Error: Could Not Get NFTs</div>
    {:else}
      {#each $nfts.data as nft, index}
        <img alt={nft.name} src={nft.image} />
      {/each}
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

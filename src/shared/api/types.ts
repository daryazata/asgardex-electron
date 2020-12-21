import { LedgerTxInfo as LedgerBTCTxInfo } from '@xchainjs/xchain-bitcoin'
import { Address, TxParams } from '@xchainjs/xchain-client'
import { Keystore } from '@xchainjs/xchain-crypto'
import { Chain } from '@xchainjs/xchain-util'
import { Either } from 'fp-ts/lib/Either'

import { Locale } from '../../shared/i18n/types'

export type ApiKeystore = {
  save: (keystore: Keystore) => Promise<void>
  remove: () => Promise<void>
  get: () => Promise<Keystore>
  exists: () => Promise<boolean>
}

export type ApiLang = {
  update: (locale: Locale) => void
}

export type ApiUrl = {
  openExternal: (url: string) => Promise<void>
}

export type Network = 'testnet' | 'chaosnet' | 'mainnet'

export enum LedgerErrorId {
  NO_DEVICE,
  ALREADY_IN_USE,
  NO_APP,
  WRONG_APP,
  DENIED,
  UNKNOWN
}

export type LedgerBNCTxInfo = TxParams & {
  sender: Address
}

export type LedgerTxInfo = LedgerBTCTxInfo | LedgerBNCTxInfo

export type ApiHDWallet = {
  getLedgerAddress: (chain: Chain, network: Network) => Promise<Either<LedgerErrorId, Address>>
  signTxInLedger: (chain: Chain, network: Network, ledgerTxInfo: LedgerTxInfo) => Promise<Either<LedgerErrorId, string>>
  sendTxInLedger: (chain: Chain, network: Network, ledgerTxInfo: LedgerTxInfo) => Promise<Either<LedgerErrorId, string>>
}

declare global {
  interface Window {
    apiKeystore: ApiKeystore
    apiLang: ApiLang
    apiUrl: ApiUrl
    apiHDWallet: ApiHDWallet
  }
}

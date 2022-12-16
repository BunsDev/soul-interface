import { FC, useEffect, useState, ComponentProps, useRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { paths } from 'nfnt-client-sdk/dist/types'
import AttributeOfferModal from './attribute/AttributeOfferModal'
import CollectionOfferModal from 'components/NFT/collections/CollectionOfferModal'
import toast from 'react-hot-toast'
import useCollectionStats from 'features/nft/hooks/useCollectionStats'
import useCollection from 'features/nft/hooks/useCollection'
import { useRouter } from 'next/router'
import useTokens from 'features/nft/hooks/useTokens'
import HeroSocialLinks from './hero/HeroSocialLinks'
import HeroBackground from './hero/HeroBackground'
import HeroStats from './hero/HeroStats'
import Sweep from './Sweep'
import ReactMarkdown from 'react-markdown'
import Toast from './Toast'
import Image from 'next/image'
import { useActiveWeb3React } from 'services/web3'

const envBannerImage = process.env.NEXT_PUBLIC_BANNER_IMAGE
const OPENSEA_API_KEY = process.env.NEXT_PUBLIC_OPENSEA_API_KEY
const ENV_COLLECTION_DESCRIPTIONS =
  process.env.NEXT_PUBLIC_COLLECTION_DESCRIPTIONS

const setToast = (data: ComponentProps<typeof Toast>['data']) => {
  toast.custom((t) => <Toast t={t} toast={toast} data={data} />)
}

type Props = {
  collectionId: string | undefined
  fallback: {
    tokens: paths['/tokens/v4']['get']['responses']['200']['schema']
    collection: paths['/collection/v2']['get']['responses']['200']['schema']
  }
}

type CollectionModalProps = ComponentProps<typeof CollectionOfferModal>
type AttibuteModalProps = ComponentProps<typeof AttributeOfferModal>

const Hero: FC<Props> = ({ fallback, collectionId }) => {
  // const { data: signer } = useSigner()
  const { chainId, library } = useActiveWeb3React()
  const CHAIN_ID = chainId

  const signer = library.getSigner()
  const collection = useCollection(fallback.collection, collectionId)
  const router = useRouter()
  const stats = useCollectionStats(router, collectionId)
  const [attribute, setAttribute] = useState<
    AttibuteModalProps['data']['attribute']
  >({
    key: undefined,
    value: undefined,
  })
  const { tokens } = useTokens(collectionId, [fallback.tokens], router)
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    const keys = Object.keys(router.query)
    const attributesSelected = keys.filter(
      (key) =>
        key.startsWith('attributes[') &&
        key.endsWith(']') &&
        router.query[key] !== ''
    )

    // Only enable the attribute modal if one attribute is selected
    if (attributesSelected.length !== 1) {
      setAttribute({
        // Extract the key from the query key: attributes[{key}]
        key: undefined,
        value: undefined,
      })
      return
    }

    setAttribute({
      // Extract the key from the query key: attributes[{key}]
      key: attributesSelected[0].slice(11, -1),
      value: router.query[attributesSelected[0]]?.toString(),
    })
  }, [router.query])

  if (!CHAIN_ID) {
    throw 'Chain ID Required'
  }

  const env: CollectionModalProps['env'] = {
    chainId: +CHAIN_ID as ChainId,
    openSeaApiKey: OPENSEA_API_KEY,
  }

  const floor = collection.data?.collection?.floorAsk

  const statsObj = {
    count: Number(collection.data?.collection?.tokenCount ?? 0),
    topOffer: collection.data?.collection?.topBid?.value,
    floor: floor?.price,
    allTime: collection.data?.collection?.volume?.allTime,
    volumeChange: collection.data?.collection?.volumeChange?.['1day'],
    floorChange: collection.data?.collection?.floorSaleChange?.['1day'],
  }

  const bannerImage =
    envBannerImage || collection?.data?.collection?.metadata?.bannerImageUrl

  //Split on commas outside of backticks (`)
  let envDescriptions = ENV_COLLECTION_DESCRIPTIONS
    ? ENV_COLLECTION_DESCRIPTIONS.split(/,(?=(?:[^\`]*\`[^\`]*\`)*[^\`]*$)/)
    : null
  let envDescription = null

  if (envDescriptions && envDescriptions.length > 0) {
    envDescriptions.find((description) => {
      const descriptionPieces = description.split('::')
      if (descriptionPieces[0] == collectionId) {
        envDescription = descriptionPieces[1].replace(/`/g, '')
      }
    })
  }

  const description =
    envDescription ||
    (collection?.data?.collection?.metadata?.description as string | undefined)
  const header = {
    banner: bannerImage as string,
    image: collection?.data?.collection?.metadata?.imageUrl as string,
    name: collection?.data?.collection?.name,
    description: description,
    shortDescription: description ? description.slice(0, 150) : description,
  }

  const isSupported =
    !!collection.data?.collection?.tokenSetId &&
    !!collection.data?.collection?.collectionBidSupported

  const isAttributeModal = !!attribute.key && !!attribute.value

  const royalties: CollectionModalProps['royalties'] = {
    bps: collection.data?.collection?.royalties?.bps,
    recipient: collection.data?.collection?.royalties?.recipient,
  }

  const collectionData: CollectionModalProps['data'] = {
    collection: {
      id: collection?.data?.collection?.id,
      image: '',
      name: collection?.data?.collection?.name,
      tokenCount: stats?.data?.stats?.tokenCount ?? 0,
    },
  }

  const attributeData: AttibuteModalProps['data'] = {
    collection: {
      id: collection.data?.collection?.id,
      image: collection?.data?.collection?.metadata?.imageUrl as string,
      name: collection?.data?.collection?.name,
      tokenCount: stats?.data?.stats?.tokenCount ?? 0,
    },
    attribute,
  }

  let isLongDescription = false
  let descriptionHeight = '60px'

  if (descriptionRef.current) {
    isLongDescription = descriptionRef.current.clientHeight > 60
    descriptionHeight = descriptionExpanded
      ? `${descriptionRef.current.clientHeight}px`
      : '60px'
  }

  return (
    <>
    {/* @ts-ignore */}
      <HeroBackground banner={header.banner}>
        <div className="z-10 flex w-full flex-col items-center gap-6">
          <Image
            className="h-20 w-20 rounded-full"
            alt={`${header.name} Logo`}
            src={header.image}
          />
          <h1 className="nfnt-h4 text-center text-black dark:text-white">
            {header.name}
          </h1>
          <HeroSocialLinks collection={collection?.data?.collection} />
          <HeroStats stats={statsObj} />
          {header.description && (
            <>
              <div
                className="relative overflow-hidden transition-[max-height] ease-in-out md:w-[423px]"
                style={{ maxHeight: descriptionHeight }}
              >
                <p
                  ref={descriptionRef}
                  className="text-center text-sm text-[#262626] transition-[width] duration-300 ease-in-out dark:text-white"
                >
                  <ReactMarkdown linkTarget="_blank">
                    {header.description}
                  </ReactMarkdown>
                </p>
              </div>
              {isLongDescription && (
                <a
                  className="mt-[-18px]"
                  onClick={(e) => {
                    e.preventDefault()
                    setDescriptionExpanded(!descriptionExpanded)
                  }}
                >
                  <FiChevronDown
                    className={`h-5 w-5 text-black transition-transform dark:text-white ${
                      descriptionExpanded ? 'rotate-180' : ''
                    }`}
                    aria-hidden
                  />
                </a>
              )}
            </>
          )}
          <div className="flex w-full flex-col justify-center gap-4 md:flex-row">
            {isSupported &&
              (isAttributeModal ? (
                <AttributeOfferModal
                  royalties={royalties}
                  signer={signer}
                  data={attributeData}
                  env={env}
                  stats={stats}
                  tokens={tokens}
                  setToast={setToast}
                />
              ) : (
                <CollectionOfferModal
                  royalties={royalties}
                  signer={signer}
                  data={collectionData}
                  env={env}
                  stats={stats}
                  tokens={tokens}
                  setToast={setToast}
                />
              ))}
            <Sweep
              collection={collection}
              tokens={tokens}
              setToast={setToast}
            />
          </div>
        </div>
      </HeroBackground>
    </>
  )
}

export default Hero

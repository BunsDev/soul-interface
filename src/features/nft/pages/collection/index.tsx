import { useWeb3React } from '@web3-react/core'
// import { OpacityHoverState } from 'components/Common'
import { useLoadAssetsQuery } from 'services/graphql/data/nft/Asset'
import { useCollectionQuery, useLoadCollectionQuery } from 'services/graphql/data/nft/Collection'
import { MobileHoverBag } from 'features/nft/components/bag/MobileHoverBag'
import { AnimatedBox, Box } from 'features/nft/components/Box'
import { Activity, ActivitySwitcher, CollectionNfts, CollectionStats, Filters } from 'features/nft/components/collection'
import { CollectionNftsAndMenuLoading } from 'features/nft/components/collection/CollectionNfts'
import { CollectionPageSkeleton } from 'features/nft/components/collection/CollectionPageSkeleton'
import { Column, Row } from 'features/nft/components/Flex'
import { BagCloseIcon } from 'features/nft/components/icons'
import { useBag, useCollectionFilters, useFiltersExpanded, useIsMobile } from 'features/nft/hooks'
import * as styles from 'features/nft/pages/collection/index.css'
import { GenieCollection } from 'features/nft/types'
import { Suspense, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSpring } from 'react-spring'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme/components/text'
import { TRANSITION_DURATIONS } from 'styles'
import { OpacityHoverState } from 'features/nft/components/Common'
import { Button } from 'components/Button'
import NavLink from 'components/NavLink'
import { useRouter } from 'next/router'
// import { TRANSITION_DURATIONS } from 'theme/styles'

const FILTER_WIDTH = 332
const BAG_WIDTH = 324

export const BannerWrapper = styled(Box)`
  height: 100px;
  @media screen and (min-width: ${({ theme }) => 600}px) {
    height: 288px;
  }
`

export const CollectionBannerLoading = () => 
<Box
//  height="full" 
//  width="full" 
 className={styles.loadingBanner}
  />

const CollectionDescriptionSection = styled(Column)`
  ${styles.ScreenBreakpointsPaddings}
`

const MobileFilterHeader = styled(Row)`
  padding: 20px 16px;
  justify-content: space-between;
`

// Sticky navbar on light mode looks incorrect because the box shadows from assets overlap the the edges of the navbar.
// As a result it needs 16px padding on either side. These paddings are offset by 16px to account for this. Please see CollectionNFTs.css.ts for the additional sizing context.
// See breakpoint values in ScreenBreakpointsPaddings above - they must match
const CollectionDisplaySection = styled(Row)`
  align-items: flex-start;
  position: relative;
`

const IconWrapper = styled.button`
  background-color: transparent;
  border-radius: 8px;
  border: none;
  color: ${({ theme }) => theme.textPrimary};
  cursor: pointer;
  display: flex;
  padding: 2px 0px;
  opacity: 1;

  ${OpacityHoverState}
`

const Collection = () => {
  const { contractAddress } = useParams()
  const isMobile = useIsMobile()
  const [isFiltersExpanded, setFiltersExpanded] = useFiltersExpanded()
  const { pathname } = useLocation()
  const router = useRouter()
  const isActivityToggled = pathname.includes('/activity')
  const setMarketCount = useCollectionFilters((state) => state.setMarketCount)
  const isBagExpanded = useBag((state) => state.bagExpanded)
  const setBagExpanded = useBag((state) => state.setBagExpanded)
  const { chainId } = useWeb3React()

  const collectionStats = useCollectionQuery(contractAddress as string)

  const { gridX, gridWidthOffset } = useSpring({
    gridX: isFiltersExpanded && !isMobile ? FILTER_WIDTH : 0,
    gridWidthOffset:
      isFiltersExpanded && !isMobile
        ? isBagExpanded
          ? BAG_WIDTH + FILTER_WIDTH
          : FILTER_WIDTH
        : isBagExpanded && !isMobile
        ? BAG_WIDTH
        : 0,
    config: {
      duration: TRANSITION_DURATIONS.medium,
      //   @ts-ignore
      // easing: easings.easeOutSine,
    },
  })

  useEffect(() => {
    const marketCount: Record<string, number> = {}
    collectionStats?.marketplaceCount?.forEach(({ marketplace, count }) => {
      marketCount[marketplace] = count
    })
    setMarketCount(marketCount)
  }, [collectionStats?.marketplaceCount, setMarketCount])

  useEffect(() => {
    setBagExpanded({ bagExpanded: false, manualClose: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleActivity = () => {
    isActivityToggled
      ? router.push(`/nft/collection/${contractAddress}`)
      : router.push(`/nft/collection/${contractAddress}/activity`)
  }

  return (
    <>
        <Column 
        // width="full"
        >
          {contractAddress ? (
            <>
              <BannerWrapper width="full">
                <Box
                  as={collectionStats?.bannerImageUrl ? 'img' : 'div'}
                  // height="full"
                  // width="full"
                  // background="none"
                  src={
                    collectionStats?.bannerImageUrl
                      ? `${collectionStats.bannerImageUrl}?w=${window.innerWidth}`
                      : undefined
                  }
                  className={styles.bannerImage}
                />
              </BannerWrapper>
              <CollectionDescriptionSection>
                {collectionStats && (
                  <CollectionStats stats={collectionStats || ({} as GenieCollection)} isMobile={isMobile} />
                )}
                <div id="nft-anchor" />
                <NavLink
                  href={`/nft/collection/${contractAddress}`}
                >
                <ActivitySwitcher
                  showActivity={isActivityToggled}
                  toggleActivity={() => {
                    isFiltersExpanded && setFiltersExpanded(false)
                    toggleActivity()
                  }}
                  />
                  </NavLink>
              </CollectionDescriptionSection>
              <CollectionDisplaySection>
                <Box
                  // position={isMobile ? 'fixed' : 'sticky'}
                  // top={{ sm: '0', md: '72' }}
                  // left="0"
                  // width={isMobile ? 'full' : '0'}
                  // height={isMobile && isFiltersExpanded ? 'full' : undefined}
                  // background={isMobile ? 'backgroundBackdrop' : undefined}
                  // zIndex="modalBackdrop"
                  // overflowY={isMobile ? 'scroll' : undefined}
                >
                  {isFiltersExpanded && (
                    <>
                      {isMobile && (
                        <MobileFilterHeader>
                          <ThemedText.HeadlineSmall>Filter</ThemedText.HeadlineSmall>
                          <IconWrapper onClick={() => setFiltersExpanded(false)}>
                            <BagCloseIcon />
                          </IconWrapper>
                        </MobileFilterHeader>
                      )}
                      <Filters traitsByGroup={collectionStats?.traits ?? {}} />
                    </>
                  )}
                </Box>

                {/* @ts-ignore: https://github.com/microsoft/TypeScript/issues/34933 */}
                <AnimatedBox
                  position={isMobile && (isFiltersExpanded || isBagExpanded) ? 'fixed' : 'static'}
                  style={{
                    // @ts-ignore
                    transform: gridX.to((x) => `translate(${x as number}px)`),
                    // @ts-ignore
                    width: gridWidthOffset.to((x) => `calc(100% - ${x as number}px)`),
                  }}
                >
                  {isActivityToggled
                    ? contractAddress && (
                        <Activity
                          contractAddress={contractAddress}
                          rarityVerified={collectionStats?.rarityVerified ?? false}
                          collectionName={collectionStats?.name ?? ''}
                          chainId={chainId}
                        />
                      )
                    : contractAddress &&
                      collectionStats && (
                        <Suspense fallback={<CollectionNftsAndMenuLoading />}>
                          <CollectionNfts
                            collectionStats={collectionStats || ({} as GenieCollection)}
                            contractAddress={contractAddress}
                            rarityVerified={collectionStats?.rarityVerified}
                          />
                        </Suspense>
                      )}
                </AnimatedBox>
              </CollectionDisplaySection>
            </>
          ) : (
            // TODO: Put no collection asset page here
            <div 
            // className={styles.noCollectionAssets}
            >No collection assets exist at this address
            </div>
          )}
        </Column>
      <MobileHoverBag />
    </>
  )
}

// The page is responsible for any queries that must be run on initial load.
// Triggering query load from the page prevents waterfalled requests, as lazy-loading them in components would prevent
// any children from rendering.
const CollectionPage = () => {
  const { contractAddress } = useParams()
  useLoadCollectionQuery(contractAddress)
  useLoadAssetsQuery(contractAddress)

  // The Collection must be wrapped in suspense so that it does not suspend the CollectionPage,
  // which is needed to trigger query loads.
  return (
    <Suspense fallback={<CollectionPageSkeleton />}>
      <Collection />
    </Suspense>
  )
}

export default CollectionPage
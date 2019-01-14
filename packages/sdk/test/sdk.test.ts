import { TripoowSDK, ResponseSDKBase } from '../src/index';
import { WebRequest } from '@tripoow/webrequest';
import { ResponseResults, RequestStream } from '@tripoow/interfaces';

describe('Tripoow SDK test', () => {
  beforeEach(() => {
    jest.setTimeout(100000);
  });

  const test = new TripoowSDK<WebRequest>(WebRequest, 'development');

  it('TripoowSDK is instantiable', () => {
    return expect(test).toBeInstanceOf(TripoowSDK);
  });

  test.setLocale('it');

  describe('Authorization', () => {

    it('set Bearer', async () => {
      const auth: ResponseResults.Authorization = await test.getBearer('bloren93@gmail.com', 'laurabartolone');
      test.setAuthorization(auth.bearer);
      return expect(auth.bearer).toBeTruthy();
    });

    it('fetch Booking', async () => {
      const responseBookings: ResponseSDKBase<ResponseResults.Bookings> = await test.getBookings();
      // console.log('BOOKINGS', responseBookings.results.expired[0]);
      return expect(responseBookings.results).toBeTruthy();
    });

  });

  describe('Steps to Pack', () => {
    const budget: number = 500;
    const travelerAdults: number = 2;
    const suggest: string = 'cata';
    const hasHotels: boolean = true;
    const temp: {
      origin?: ResponseResults.Origin;
      destination?: ResponseResults.Destination;
      dates?: ResponseResults.Dates;
    } = {};

    it('f. Origins', async () => {
      const streamOrigin: RequestStream<ResponseResults.Origin, ResponseSDKBase<ResponseResults.Origin[]>> = test.streamOrigins({suggest: suggest});
      const origins: ResponseResults.Origin[] = await streamOrigin.next();
      temp.origin = origins[0];
      // console.log('ORIGINS', origins[0]);
      return expect(origins[0]).toBeTruthy();
    });

    it('f. Destinations', async () => {
      if (!temp.origin) {
        return expect(temp.origin).toBeTruthy();
      }
      const streamDestinations: RequestStream<ResponseResults.Destination, ResponseSDKBase<ResponseResults.Destination[]>> = test.streamDestinations({
        budget: budget,
        originCode: temp.origin.code,
        hasHotels: hasHotels
      });
      const destinations: ResponseResults.Destination[] = await streamDestinations.next();
      temp.destination = destinations[0];
      // console.log('DESTINATIONS', destinations[0]);
      return expect(destinations[0]).toBeTruthy();
    });

    describe('Destination Details', () => {
      it('f. Wiki', async () => {
        if (!temp.destination) {
          return expect(temp.destination).toBeTruthy();
        }
        const wiki: ResponseResults.DestinationWiki = await test.getDestinationWiki(temp.destination.code);
        // console.log('WIKI', wiki);
        return expect(wiki).toBeTruthy();
      });

      it('f. Tags', async () => {
        if (!temp.destination) {
          return expect(temp.destination).toBeTruthy();
        }
        const tags: ResponseResults.DestinationTag[] = await test.getDestinationTags(temp.destination.code);
        // console.log('TAGS', tags);
        return expect(tags).toBeTruthy();
      });

      it('f. Images', async () => {
        if (!temp.destination) {
          return expect(temp.destination).toBeTruthy();
        }
        const images: ResponseResults.DestinationImage[] = await test.getDestinationImages(temp.destination.code);
        // console.log('IMAGES', images);
        return expect(images).toBeTruthy();
      });
    });

    it('f. Dates', async () => {
      if (!temp.origin || !temp.destination) {
        return expect(temp.origin).toBeTruthy();
      }
      const streamDates: RequestStream<ResponseResults.Dates, ResponseSDKBase<ResponseResults.Dates[]>> = test.streamDates({
        budget: budget,
        type: 'weeks',
        originCode: temp.origin.code,
        destinationCode: temp.destination.code,
        hasHotels: hasHotels
      });
      const dates: ResponseResults.Dates[] = await streamDates.next();
      temp.dates = dates[0];
      // console.log('DATES', date);
      return expect(dates[0]).toBeTruthy();
    });

    it('f. Packs', async () => {
      if (!temp.origin || !temp.destination || !temp.dates) {
        return expect(temp.dates).toBeTruthy();
      }
      const streamPacks: RequestStream<ResponseResults.Pack, ResponseSDKBase<ResponseResults.Pack[]>> = test.streamPacks({
        budget: budget,
        outwardDate: temp.dates.outward,
        returnDate: temp.dates.return,
        itineraries: [
          {
            origin: {
              code: temp.origin.code,
            },
            destination: {
              code: temp.destination.code
            }
          },
          {
            origin: {
              code: temp.destination.code
            },
            destination: {
              code: temp.origin.code
            }
          }
        ],
        travelers: {
          adults: travelerAdults
        }
      });
      const packs: ResponseResults.Pack[] = await streamPacks.next();
      // console.log('PACKS', packs[0]);
      return expect(packs).toBeTruthy();
    });

    it('f. Accomodations', async () => {
      if (!temp.origin || !temp.destination || !temp.dates) {
        return expect(temp.dates).toBeTruthy();
      }
      const streamAccomodations: RequestStream<ResponseResults.Accomodation, ResponseSDKBase<ResponseResults.Accomodation[]>> = test.streamAccomodations({
        priceNightMax: budget,
        destinationCode: temp.destination.code,
        checkin: temp.dates.outward,
        checkout: temp.dates.return,
        guests: [
          {
            adults: travelerAdults
          }
        ]
      });
      const accomodations: ResponseResults.Accomodation[] = await streamAccomodations.next();
      expect(accomodations).toBeTruthy();
      // console.log('ACCOMODATIONS', accomodations[0]);

      const hotelDetails: ResponseSDKBase<ResponseResults.Accomodation> = await test.getHotelDetails({
        checkin: accomodations[0].checkin,
        checkout: accomodations[0].checkout,
        destinationCode: temp.destination.code,
        guests: [
          {
            adults: travelerAdults
          }
        ],
        id: accomodations[0].id
      });
      expect(hotelDetails.results).toBeTruthy();
      // console.log('HOTEL-DETAILS', hotelDetails.results);
    });


    describe('Packs', () => {

      const tempPack: {
        pack?: ResponseResults.Pack;
      } = {};

      it('f. Packs Overview', async () => {
        if (!temp.origin || !temp.destination || !temp.dates) {
          return expect(temp.dates).toBeTruthy();
        }
        const packsOverview: ResponseSDKBase<ResponseResults.PackOverview> = await test.getPacksOverview({
          budget: budget,
          outwardDate: temp.dates.outward,
          returnDate: temp.dates.return,
          travelers: {
            adults: travelerAdults
          },
          itineraries: [
            {
              origin: {
                code: temp.origin.code,
              },
              destination: {
                code: temp.destination.code
              }
            },
            {
              origin: {
                code: temp.destination.code
              },
              destination: {
                code: temp.origin.code
              }
            }
          ],
          guests: [
            {
              adults: travelerAdults
            }
          ]
        });
        // console.log('PACKOVERVIEW', packsOverview.results.cheapest);
        tempPack.pack = packsOverview.results.cheapest;
        return expect(packsOverview.results.cheapest).toBeTruthy();
      });


      it('f. Pack Crossover', async () => {
        if (!tempPack.pack) {
          return expect(tempPack.pack).toBeTruthy();
        }
        const responsePackCrossover: ResponseSDKBase<ResponseResults.Pack> = await test.postPackCrossover({
          packOldToken: tempPack.pack.token,
          hotel: {
            delete: true
          }
        });
        // console.log('PACK-CROSSOVER', responsePackCrossover.results);
      });

      it('f. Pack Check', async () => {
        if (!tempPack.pack) {
          return expect(tempPack.pack).toBeTruthy();
        }
        const responsePackCheck: ResponseSDKBase<ResponseResults.PackCheck> = await test.getPackCheck(tempPack.pack.token);
        // console.log('PACK-CHECK', responsePackCheck.results);
        return expect(responsePackCheck.results).toBeTruthy();
      });

    });

  });

});

import { readonly, toRef, reactive } from 'vue';
import { u as useApi } from './api-BDnKztVE.mjs';

const globalCache = reactive({
  partners: [],
  units: [],
  partnersLastLoaded: 0,
  unitsLastLoaded: 0
});
const CACHE_DURATION = 5 * 60 * 1e3;
const useGlobalCache = () => {
  const { getPartners, getUnits } = useApi();
  const loadPartners = async (force = false) => {
    if (!force && globalCache.partners.length > 0 && Date.now() - globalCache.partnersLastLoaded < CACHE_DURATION) {
      return globalCache.partners;
    }
    try {
      const result = await getPartners();
      if (result && result.success && result.data) {
        globalCache.partners = Array.isArray(result.data) ? result.data : [];
      } else if (Array.isArray(result)) {
        globalCache.partners = result;
      } else {
        globalCache.partners = [];
      }
      globalCache.partnersLastLoaded = Date.now();
      return globalCache.partners;
    } catch (error) {
      return [];
    }
  };
  const loadUnits = async (force = false) => {
    if (!force && globalCache.units.length > 0 && Date.now() - globalCache.unitsLastLoaded < CACHE_DURATION) {
      return globalCache.units;
    }
    try {
      const result = await getUnits();
      if (result && result.success && result.data) {
        globalCache.units = Array.isArray(result.data) ? result.data : [];
      } else if (Array.isArray(result)) {
        globalCache.units = result;
      } else {
        globalCache.units = [];
      }
      globalCache.unitsLastLoaded = Date.now();
      return globalCache.units;
    } catch (error) {
      return [];
    }
  };
  const invalidateCache = (type) => {
    if (type === "partners" || !type) {
      globalCache.partners = [];
      globalCache.partnersLastLoaded = 0;
    }
    if (type === "units" || !type) {
      globalCache.units = [];
      globalCache.unitsLastLoaded = 0;
    }
  };
  return {
    partners: readonly(toRef(globalCache, "partners")),
    units: readonly(toRef(globalCache, "units")),
    loadPartners,
    loadUnits,
    invalidateCache
  };
};

export { useGlobalCache as u };
//# sourceMappingURL=useGlobalCache-zS6YtHq1.mjs.map

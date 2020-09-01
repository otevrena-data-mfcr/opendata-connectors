# Opendata konektory

Skripty získávájí informace o datových sadách z informačních systémů a tvoří z nich výstup kompatibilní s [OFN](https://github.com/opendata-mvcr/otevrene-formalni-normy/tree/master/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat)

## CKAN

CKAN API bohužel nezaručuje dostatečná data pro validní OFN výstup. Výstupy jsou proto omezené.

Nedostatky:
 - Hodnota `typ_média` u typu `DistribuceSoubor` nemusí být vyplněná. Při chybějící hodnotě v CKAN API se dohledává MIME dle nejznámějších typů souborů. V případě, že je nenalezen, je pole prázdné.

import {CardComponent} from "@/widgets/production-floor-widget/components/card-component";

const StatusColumnComponent = () => {
    return(
        <div style={{maxWidth: '310px', maxHeight: '783px', boxShadow: '0 0 40px 0 #00000014', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 3px', padding: 5 }}>
            <div style={{width: 280, height: 80, backgroundColor: 'blue', color: '#FFF',borderRadius: '16px', borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}></div>
            <div style={{width: '285px',maxHeight: 700, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, maxWidth: '100%', padding: '16px 5px'}}>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
                <CardComponent/>
            </div>
        </div>
    );
}

export {StatusColumnComponent}